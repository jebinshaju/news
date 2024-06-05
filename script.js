document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const hiddenItemsContainer = document.getElementById('hidden-items');
    const hiddenItemTemplate = document.getElementById('hidden-item-template').content.firstElementChild;

    let dragItem = null;

    document.querySelectorAll('.video-container').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.querySelector('.close-btn').addEventListener('click', () => hideItem(item));
    });

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);

    function handleDragStart(e) {
        dragItem = this;
        setTimeout(() => (this.style.display = 'none'), 0);
    }

    function handleDragEnd(e) {
        setTimeout(() => (dragItem.style.display = 'block'), 0);
        dragItem = null;
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(dragItem);
        } else {
            container.insertBefore(dragItem, afterElement);
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.video-container:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function hideItem(item) {
        const hiddenItem = hiddenItemTemplate.cloneNode(true);
        hiddenItem.textContent = 'Restore';
        hiddenItem.addEventListener('click', () => restoreItem(item, hiddenItem));
        hiddenItemsContainer.appendChild(hiddenItem);
        item.style.display = 'none';
    }

    function restoreItem(item, hiddenItem) {
        item.style.display = 'block';
        hiddenItem.remove();
    }
});
