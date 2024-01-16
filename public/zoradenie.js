function sortPosts() {
    let criteria = document.getElementById('sortCriteria').value;
    let posts = Array.from(document.querySelectorAll('.post'));

    switch(criteria) {
    case 'name':
        posts.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    break;
    case 'date':
        posts.sort((a, b) => new Date(a.dataset.datekonania) - new Date(b.dataset.datekonania));
    break;
    case 'region':
        posts.sort((a, b) => a.dataset.region.localeCompare(b.dataset.region));
        break;
}

    var container = document.getElementById('postsContainer');
    container.innerHTML = '';
    posts.forEach(post => container.appendChild(post));
}

 document.addEventListener('DOMContentLoaded', sortPosts);