// CategorySelection.jsx
const categories = [
  { id: 9, name: "General Knowledge" },
  { id: 11, name: "Film" },
  { id: 12, name: "Music" },
  { id: 15, name: "Video Games" },
  { id: 21, name: "Sports" },
  { id: 22, name: "Geography" },
  { id: 27, name: "Animals" },
];

export default function CategorySelection({ onSelectCategory }) {
  const handleCategorySelect = (category) => {
    /* Save category in sessionStorage */
    sessionStorage.setItem("selectedCategory", JSON.stringify(category));
    onSelectCategory(category);
  };

  return (
    <div>
      <h2>Select a category</h2>
      <div className="category-selection">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => handleCategorySelect(cat)}>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
