const API = "/api";

// 📚 load sách
fetch("/api/books")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("books");

    data.forEach(book => {
      container.innerHTML += `
        <div class="card">
          <h3>${book.title}</h3>
          <a href="book.html?pdf=${encodeURIComponent(book.pdfUrl)}">
            Đọc 📖
          </a>
        </div>
      `;
    });
  });

// 🎥 load video
fetch(API + "/videos")
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById("videos");

    data.forEach((video) => {
      container.innerHTML += `
        <div class="card">
          <video width="150" controls>
            <source src="${video.videoUrl}" type="video/mp4">
          </video>
          <h3>${video.title}</h3>
        </div>
      `;
    });
  });
