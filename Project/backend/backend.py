from flask import Flask, request, jsonify
import os
import json
from flask_cors import CORS
from openai import OpenAI
from openai import AzureOpenAI
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenAI client however you want
client = AzureOpenAI()

@app.route('/api/schedule', methods=['POST'])
def schedule_tasks():
    """
    Endpoint to schedule new tasks based on existing calendar events
    
    Expected input format:
    {
        "existing_calendar": [
            {
                "task_name": "Weekly Meeting",
                "start_time": "2025-05-01T10:00:00",
                "end_time": "2025-05-01T11:00:00"
            },
            ...
        ],
        "new_tasks": [
            {
                "task_name": "Write Project Proposal",
                "duration_minutes": 60,
                "priority": "high",
                "preferred_time_range": {
                    "earliest": "09:00",
                    "latest": "17:00"
                },
                "deadline": "2025-05-03T23:59:59",
                "tags": ["work", "writing"]
            },
            ...
        ],
        "user_preferences": {
            "work_start_time": "09:00",
            "work_end_time": "17:00",
            "break_duration": 15,
            "preferred_break_frequency": 120
        }
    }
    
    Returns:
    {
        "scheduled_tasks": [
            {
                "task_name": "Write Project Proposal",
                "start_time": "2025-05-01T13:00:00",
                "end_time": "2025-05-01T14:00:00"
            },
            ...
        ],
        "status": "success"
    }
    """
    try:
        data = request.get_json()
        
        # Extract data from the request
        existing_calendar = data.get('existing_calendar', [])
        new_tasks = data.get('new_tasks', [])
        user_preferences = data.get('user_preferences', {})
        
        # Validate request data
        if not new_tasks:
            return jsonify({"error": "No tasks provided for scheduling"}), 400
        
        # Call the scheduling function
        scheduled_tasks = generate_optimized_schedule(existing_calendar, new_tasks, user_preferences)
        
        return jsonify({
            "status": "success",
            "scheduled_tasks": scheduled_tasks
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_optimized_schedule(existing_calendar, new_tasks, user_preferences):
    """
    Use OpenAI API to generate an optimized schedule for the new tasks
    based on the existing calendar and user preferences
    """
    # Format the input data for the prompt
    formatted_calendar = format_calendar_for_prompt(existing_calendar)
    formatted_tasks = format_tasks_for_prompt(new_tasks)
    formatted_preferences = format_preferences_for_prompt(user_preferences)
    
    # Create the prompt for OpenAI
    prompt = create_scheduling_prompt(formatted_calendar, formatted_tasks, formatted_preferences)
    
    # Make the API call to OpenAI
    response = client.chat.completions.create(
        model="gpt-4o",  # Specify the model you want to use
        messages=[
            {"role": "system", "content": "You are a calendar optimization assistant. Your task is to schedule events optimally based on existing commitments, task priorities, and user preferences. Respond ONLY with the JSON array of scheduled tasks in the exact format specified."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,  # Low temperature for more deterministic responses
        response_format={"type": "json_object"}  # Ensure response is in JSON format
    )
    
    # Extract and parse the schedule from the response
    try:
        schedule_text = response.choices[0].message.content
        schedule_data = json.loads(schedule_text)
        scheduled_tasks = schedule_data.get("scheduled_tasks", [])
        
        # Validate the scheduled tasks
        validate_scheduled_tasks(scheduled_tasks, existing_calendar)
        
        return scheduled_tasks
    
    except json.JSONDecodeError:
        raise Exception("Failed to parse scheduling response from AI")

def format_calendar_for_prompt(existing_calendar):
    """Format the existing calendar events for the prompt"""
    if not existing_calendar:
        return "No existing calendar events."
    
    calendar_text = "Existing calendar events:\n"
    for i, event in enumerate(existing_calendar, 1):
        start_time = event.get("start_time", "")
        end_time = event.get("end_time", "")
        task_name = event.get("task_name", "Unnamed event")
        
        calendar_text += f"{i}. {task_name}: {start_time} to {end_time}\n"
    
    return calendar_text

def format_tasks_for_prompt(new_tasks):
    """Format the new tasks to be scheduled for the prompt"""
    if not new_tasks:
        return "No new tasks to schedule."
    
    tasks_text = "Tasks to be scheduled:\n"
    for i, task in enumerate(new_tasks, 1):
        task_name = task.get("task_name", "Unnamed task")
        duration = task.get("duration_minutes", 0)
        priority = task.get("priority", "medium")
        preferred_time_range = task.get("preferred_time_range", {})
        earliest = preferred_time_range.get("earliest", "")
        latest = preferred_time_range.get("latest", "")
        deadline = task.get("deadline", "")
        tags = ", ".join(task.get("tags", []))
        
        tasks_text += f"{i}. {task_name}\n"
        tasks_text += f"   - Duration: {duration} minutes\n"
        tasks_text += f"   - Priority: {priority}\n"
        
        if earliest and latest:
            tasks_text += f"   - Preferred time: between {earliest} and {latest}\n"
        
        if deadline:
            tasks_text += f"   - Deadline: {deadline}\n"
        
        if tags:
            tasks_text += f"   - Tags: {tags}\n"
    
    return tasks_text

def format_preferences_for_prompt(user_preferences):
    """Format the user preferences for the prompt"""
    if not user_preferences:
        return "No specific user preferences provided."
    
    pref_text = "User preferences:\n"
    work_start = user_preferences.get("work_start_time", "")
    work_end = user_preferences.get("work_end_time", "")
    break_duration = user_preferences.get("break_duration", "")
    break_frequency = user_preferences.get("preferred_break_frequency", "")
    
    if work_start and work_end:
        pref_text += f"- Working hours: {work_start} to {work_end}\n"
    
    if break_duration:
        pref_text += f"- Break duration: {break_duration} minutes\n"
    
    if break_frequency:
        pref_text += f"- Preferred break frequency: every {break_frequency} minutes\n"
    
    return pref_text

def create_scheduling_prompt(formatted_calendar, formatted_tasks, formatted_preferences):
    """Create the prompt for the OpenAI API call"""
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    prompt = f"""
Today's date is {current_date}.

I need to schedule new tasks in my calendar based on the following information:

{formatted_calendar}

{formatted_tasks}

{formatted_preferences}

Please create an optimized schedule for these new tasks, ensuring:
1. No overlaps with existing calendar events
2. Tasks are scheduled according to their priority
3. Tasks respect their preferred time ranges and deadlines
4. Work hours and break preferences are respected when possible

Your response should be a JSON object with a "scheduled_tasks" array where each task has:
- task_name (string): The original name of the task
- start_time (ISO 8601 datetime string): When the task should start
- end_time (ISO 8601 datetime string): When the task should end

Example response format:
{{
    "scheduled_tasks": [
        {{
            "task_name": "Write Project Proposal",
            "start_time": "2025-05-01T13:00:00",
            "end_time": "2025-05-01T14:00:00"
        }},
        ...
    ]
}}

Return ONLY the JSON object with no additional text.
"""
    return prompt

def validate_scheduled_tasks(scheduled_tasks, existing_calendar):
    """Validate the scheduled tasks for format and conflicts"""
    # Check for required fields
    for task in scheduled_tasks:
        if not all(key in task for key in ["task_name", "start_time", "end_time"]):
            raise Exception("Invalid task format in AI response")
    
    # Check for time conflicts
    all_events = existing_calendar + scheduled_tasks
    for i, event1 in enumerate(all_events):
        start1 = datetime.fromisoformat(event1["start_time"])
        end1 = datetime.fromisoformat(event1["end_time"])
        
        for j, event2 in enumerate(all_events):
            if i == j:
                continue  # Skip comparing an event with itself
                
            start2 = datetime.fromisoformat(event2["start_time"])
            end2 = datetime.fromisoformat(event2["end_time"])
            
            # Check for overlap
            if (start1 <= start2 < end1) or (start1 < end2 <= end1) or (start2 <= start1 and end2 >= end1):
                # If conflict is between two scheduled tasks
                if i >= len(existing_calendar) and j >= len(existing_calendar):
                    raise Exception(f"Scheduling conflict between new tasks: {event1['task_name']} and {event2['task_name']}")
                # If conflict is between existing event and scheduled task
                elif i >= len(existing_calendar) or j >= len(existing_calendar):
                    raise Exception(f"Scheduling conflict with existing calendar event")

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)