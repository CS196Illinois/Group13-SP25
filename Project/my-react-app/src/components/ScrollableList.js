import React from "react";

const ScrollableList = () => {
    const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);

    const addItem = () => {
        setItems((prevItems) => [...prevItems, `Item ${prevItems.length + 1}`]);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-80 h-96 border-2 border-gray-300 rounded-lg overflow-y-auto p-4 shadow-md">
                {items.map((item, index) => (
                    <div 
                        key={index}
                        className="p-2 border-b last:border-none hover:bg-gray-100 transition"
                    >
                        {item}
                    </div>
                ))}
            </div>
            <Button    
                onClick={addItem}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Add Item
            </Button>
        </div>
        );
}
export default ScrollableList;

const Button = ({type, variant, className, id, onClick, children}) => {
  return (
    <button 
      type={type ? type : "button"} 
      className={className ? `btn-component ${className}` : "btn-component"}
      id={id}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

