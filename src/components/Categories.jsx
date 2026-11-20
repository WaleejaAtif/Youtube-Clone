import { useState } from "react";
import "./Categories.css";

function Categories() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Music",
    "Gaming",
    "Programming",
    "Live",
    "Podcasts",
    "Web Development",
    "React",
    "JavaScript",
    "Computer Science",
    "Recently Uploaded",
  ];

  return (
    <div className="categories">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={
            activeCategory === category ? "category active" : "category"
          }
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Categories;