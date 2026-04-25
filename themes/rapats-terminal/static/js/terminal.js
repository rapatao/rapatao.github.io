let selectedIndex = -1;
let contentIndex = -1;
let linkIndex = -1;

function clearContentSelection(nodes) {
    if (contentIndex >= 0 && nodes[contentIndex]) {
        nodes[contentIndex].classList.remove('selected-content');
        const links = nodes[contentIndex].querySelectorAll('a');
        links.forEach(l => l.classList.remove('link-focused'));
    }
}

document.addEventListener('keydown', function(e) {
    const items = document.querySelectorAll('.post-item');
    const contentNodes = document.querySelectorAll('.post-content-area > p, .post-content-area > ul, .post-content-area > ol, .post-content-area > pre, .post-content-area > blockquote, .post-content-area > aside, .post-content-area > h2, .post-content-area > h3, .post-content-area > h4, .post-content-area > table, .post-content-area > .highlight, .nav-prev, .nav-next');
    
    // Internal Post Content Navigation
    if (contentNodes.length > 0) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const isDown = e.key === 'ArrowDown';
            
            if (contentIndex >= 0) {
                const currentBlock = contentNodes[contentIndex];
                const links = currentBlock.querySelectorAll('a');
                
                if (links.length > 0) {
                    if (isDown && linkIndex < links.length - 1) {
                        e.preventDefault();
                        if (linkIndex >= 0) links[linkIndex].classList.remove('link-focused');
                        linkIndex++;
                        links[linkIndex].classList.add('link-focused');
                        return;
                    } else if (!isDown && linkIndex > 0) {
                        e.preventDefault();
                        links[linkIndex].classList.remove('link-focused');
                        linkIndex--;
                        links[linkIndex].classList.add('link-focused');
                        return;
                    } else if (linkIndex !== -1) {
                        links[linkIndex].classList.remove('link-focused');
                        linkIndex = -1;
                    }
                }
            }

            if (isDown) {
                if (contentIndex < contentNodes.length - 1) {
                    e.preventDefault();
                    clearContentSelection(contentNodes);
                    contentIndex++;
                    contentNodes[contentIndex].classList.add('selected-content');
                    contentNodes[contentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    linkIndex = -1;
                }
            } else {
                if (contentIndex > 0) {
                    e.preventDefault();
                    clearContentSelection(contentNodes);
                    contentIndex--;
                    contentNodes[contentIndex].classList.add('selected-content');
                    contentNodes[contentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    const newBlockLinks = contentNodes[contentIndex].querySelectorAll('a');
                    if (newBlockLinks.length > 0) {
                        linkIndex = newBlockLinks.length - 1;
                        newBlockLinks[linkIndex].classList.add('link-focused');
                    } else {
                        linkIndex = -1;
                    }
                }
            }
        } else if (e.key === 'Enter') {
            if (contentIndex >= 0) {
                const currentBlock = contentNodes[contentIndex];
                if (linkIndex >= 0) {
                    const links = currentBlock.querySelectorAll('a');
                    if (links[linkIndex]) {
                        e.preventDefault();
                        links[linkIndex].click();
                    }
                } else {
                    const link = currentBlock.querySelector('a');
                    if (link) {
                        e.preventDefault();
                        link.click();
                    }
                }
            } else if (selectedIndex >= 0) {
                const link = items[selectedIndex].querySelector('a');
                if (link) link.click();
            }
        }
    }

    // List Navigation (Vertical)
    if (items.length > 0) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (selectedIndex < items.length - 1) {
                if (selectedIndex >= 0) items[selectedIndex].classList.remove('selected');
                selectedIndex++;
                items[selectedIndex].classList.add('selected');
                items[selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (selectedIndex > 0) {
                items[selectedIndex].classList.remove('selected');
                selectedIndex--;
                items[selectedIndex].classList.add('selected');
                items[selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            const link = items[selectedIndex].querySelector('a');
            if (link) link.click();
        }
    }

    // Pagination/Post Navigation (Horizontal)
    const nextLink = document.querySelector('.pagination .next a, .nav-next a');
    const prevLink = document.querySelector('.pagination .prev a, .nav-prev a');
    
    if (e.key === 'ArrowRight' && nextLink && contentIndex === -1 && selectedIndex === -1) {
        nextLink.click();
    } else if (e.key === 'ArrowLeft' && prevLink && contentIndex === -1 && selectedIndex === -1) {
        prevLink.click();
    }

    // Global shortcuts (H, P, N, R)
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const key = e.key.toLowerCase();
        if (key === 'h') {
            window.location.href = "/";
        } else if (key === 'p') {
            const prevLink = document.querySelector('.pagination .prev a, .nav-prev a');
            if (prevLink) prevLink.click();
        } else if (key === 'n') {
            const nextLink = document.querySelector('.pagination .next a, .nav-next a');
            if (nextLink) nextLink.click();
        } else if (key === 'r') {
            window.location.href = "/resume/";
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const contentNodes = document.querySelectorAll('.post-content-area > p, .post-content-area > ul, .post-content-area > ol, .post-content-area > pre, .post-content-area > blockquote, .post-content-area > aside, .post-content-area > h2, .post-content-area > h3, .post-content-area > h4, .post-content-area > table, .post-content-area > .highlight, .nav-prev, .nav-next');
    
    contentNodes.forEach((node, index) => {
        node.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            clearContentSelection(contentNodes);
            contentIndex = index;
            linkIndex = -1;
            node.classList.add('selected-content');
        });
    });

    const items = document.querySelectorAll('.post-item');
    items.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].classList.remove('selected');
            }
            selectedIndex = index;
            item.classList.add('selected');
        });
    });
});
