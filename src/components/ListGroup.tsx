import { useState } from "react";

interface ListGroupProps {
  items: string[];
  heading: string;
  onSelectItem: (item: string) => void;
}
function ListGroup({ items, heading, onSelectItem }: ListGroupProps) {
  // items = [];
  if (items.length === 0) {
    return <p>No items found</p>;
  }
  let [selind, setselind] = useState(-1);
  return (
    <>
      <h1>{heading}</h1>
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={index}
            className={
              selind === index ? "list-group-item active" : "list-group-item"
            }
            onClick={() =>{
                setselind(index)
                onSelectItem(item)
            }
            }

          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
