import React, { useState, useEffect } from "react";
import "../styles/magazinePage.css";

const MagazinePage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetching magazine articles (dummy data for now)
    const fetchArticles = () => {
      const dummyArticles = [
        {
          id: 1,
          title: "The Future of AI",
          author: "John Doe",
          content: "Artificial Intelligence is evolving at an unprecedented rate...",
        },
        {
          id: 2,
          title: "Poetry Night",
          author: "Jane Smith",
          content: "The stars above shimmer brightly as our words take flight...",
        },
      ];
      setArticles(dummyArticles);
    };

    fetchArticles();
  }, []);

  return (
    <div className="magazine-container">
      <h2>📝 Magazine</h2>

      <div className="articles-list">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.id} className="article-card">
              <h3>{article.title}</h3>
              <p><strong>By:</strong> {article.author}</p>
              <p>{article.content}</p>
            </div>
          ))
        ) : (
          <p className="no-articles">No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default MagazinePage;
