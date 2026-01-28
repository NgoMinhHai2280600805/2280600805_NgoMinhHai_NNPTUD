const postList = document.getElementById("postList");
const commentList = document.getElementById("commentList");

function loadPosts() {
    fetch("http://localhost:3000/posts")
        .then(res => res.json())
        .then(posts => {
            const list = document.getElementById("postList");
            list.innerHTML = "";

            posts.forEach(post => {
                const li = document.createElement("li");

                if (post.isDeleted) li.classList.add("deleted");

                li.innerHTML = `
                    <div class="post-info">
                        <b>${post.title}</b> (${post.views} views)
                    </div>
                    <div class="actions">
                        ${
                            post.isDeleted
                            ? `
                                <button class="btn-add" onclick="restorePost('${post.id}')">♻ Khôi phục</button>
                                <button class="btn-delete" onclick="hardDeletePost('${post.id}')">❌ Xóa luôn</button>
                              `
                            : `
                                <button class="btn-edit" onclick="editPost('${post.id}', '${post.title}', ${post.views})">✏ Sửa</button>
                                <button class="btn-delete" onclick="softDeletePost('${post.id}')">🗑 Xóa mềm</button>
                              `
                        }
                    </div>
                `;

                list.appendChild(li);
            });
        });
}


function addPost() {
    const title = document.getElementById("titleInput").value;
    const views = document.getElementById("viewsInput").value;

    fetch("http://localhost:3000/posts")
        .then(res => res.json())
        .then(posts => {
            const maxId = posts.length ? Math.max(...posts.map(p => Number(p.id))) : 0;
            const newId = String(maxId + 1);

            return fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: newId,
                    title: title,
                    views: Number(views),
                    isDeleted: false
                })
            });
        })
        .then(() => {
            loadPosts();
        });
}

function editPost(id, oldTitle, oldViews) {
    const newTitle = prompt("Tiêu đề mới:", oldTitle);
    const newViews = prompt("Views mới:", oldViews);
    if (!newTitle || !newViews) return;

    fetch("http://localhost:3000/posts/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id,
            title: newTitle,
            views: Number(newViews),
            isDeleted: false
        })
    }).then(() => loadPosts());
}


function softDeletePost(id) {
    fetch("http://localhost:3000/posts/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    }).then(() => loadPosts());
}

function restorePost(id) {
    fetch("http://localhost:3000/posts/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: false })
    }).then(() => loadPosts());
}

function hardDeletePost(id) {
    if (!confirm("Xóa vĩnh viễn post này?")) return;

    fetch("http://localhost:3000/posts/" + id, {
        method: "DELETE"
    }).then(() => loadPosts());
}


function loadComments() {
    fetch("http://localhost:3000/comments")
        .then(res => res.json())
        .then(comments => {
            commentList.innerHTML = "";
            comments.forEach(c => {
                const li = document.createElement("li");
                li.innerHTML = `
                    [Post ${c.postId}] ${c.text}
                    <button onclick="deleteComment('${c.id}')">Xóa</button>
                `;
                commentList.appendChild(li);
            });
        });
}

function addComment() {
    const text = document.getElementById("commentText").value;
    const postId = document.getElementById("commentPostId").value;

    fetch("http://localhost:3000/comments")
        .then(res => res.json())
        .then(comments => {
            const maxId = comments.length > 0 ? Math.max(...comments.map(c => Number(c.id))) : 0;
            const newId = String(maxId + 1);

            fetch("http://localhost:3000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: newId, text, postId })
            }).then(() => loadComments());
        });
}

function deleteComment(id) {
    fetch(`http://localhost:3000/comments/${id}`, {
        method: "DELETE"
    }).then(() => loadComments());
}

loadPosts();
loadComments();
