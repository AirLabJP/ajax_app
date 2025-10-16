import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "content", "list", "post"]
  static values = { 
    createUrl: String,
    toggleUrl: String,
    deleteUrl: String 
  }

  connect() {
    this.loadPosts()
  }

  async createPost(event) {
    event.preventDefault()
    
    const formData = new FormData(this.formTarget)
    const content = formData.get('post[content]')
    
    if (!content || content.trim() === '') {
      this.showError('内容を入力してください')
      return
    }

    try {
      const response = await fetch(this.createUrlValue, {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.addPostToList(data.post)
      this.clearForm()
      this.showSuccess('投稿が作成されました')
    } catch (error) {
      console.error('Error creating post:', error)
      this.showError('投稿の作成に失敗しました')
    }
  }

  async toggleChecked(event) {
    const postElement = event.currentTarget.closest('[data-post-id]')
    const postId = postElement.dataset.postId
    const toggleUrl = `/posts/${postId}/toggle_checked`

    try {
      const response = await fetch(toggleUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.updatePostElement(postElement, data.post)
    } catch (error) {
      console.error('Error toggling post:', error)
      this.showError('ステータスの更新に失敗しました')
    }
  }

  async deletePost(event) {
    const postElement = event.currentTarget.closest('[data-post-id]')
    const postId = postElement.dataset.postId
    const deleteUrl = `/posts/${postId}`

    if (!confirm('この投稿を削除しますか？')) {
      return
    }

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      postElement.remove()
      this.showSuccess('投稿が削除されました')
    } catch (error) {
      console.error('Error deleting post:', error)
      this.showError('投稿の削除に失敗しました')
    }
  }

  async loadPosts() {
    try {
      const response = await fetch('/posts')
      if (response.ok) {
        // Posts are already loaded in the initial HTML
        this.attachEventListeners()
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }

  attachEventListeners() {
    this.postTargets.forEach(postElement => {
      const toggleButton = postElement.querySelector('[data-action="click->posts#toggleChecked"]')
      const deleteButton = postElement.querySelector('[data-action="click->posts#deletePost"]')
      
      if (toggleButton) {
        toggleButton.addEventListener('click', this.toggleChecked.bind(this))
      }
      if (deleteButton) {
        deleteButton.addEventListener('click', this.deletePost.bind(this))
      }
    })
  }

  addPostToList(post) {
    const postHtml = this.createPostHtml(post)
    this.listTarget.insertAdjacentHTML('afterbegin', postHtml)
    
    // Attach event listeners to the new post
    const newPostElement = this.listTarget.firstElementChild
    const toggleButton = newPostElement.querySelector('[data-action="click->posts#toggleChecked"]')
    const deleteButton = newPostElement.querySelector('[data-action="click->posts#deletePost"]')
    
    if (toggleButton) {
      toggleButton.addEventListener('click', this.toggleChecked.bind(this))
    }
    if (deleteButton) {
      deleteButton.addEventListener('click', this.deletePost.bind(this))
    }
  }

  createPostHtml(post) {
    const checkedClass = post.checked ? 'checked' : ''
    const checkedText = post.checked ? '完了' : '未完了'
    const createdAt = new Date(post.created_at).toLocaleString('ja-JP')
    
    return `
      <div class="post ${checkedClass}" data-post-id="${post.id}">
        <div class="post-header">
          <span class="post-date">${createdAt}</span>
          <div class="post-actions">
            <button class="btn btn-sm btn-outline-primary" data-action="click->posts#toggleChecked">
              ${checkedText}
            </button>
            <button class="btn btn-sm btn-outline-danger" data-action="click->posts#deletePost">
              削除
            </button>
          </div>
        </div>
        <div class="post-content">${this.escapeHtml(post.content)}</div>
      </div>
    `
  }

  updatePostElement(postElement, post) {
    const checkedClass = post.checked ? 'checked' : ''
    const checkedText = post.checked ? '完了' : '未完了'
    
    postElement.className = `post ${checkedClass}`
    const toggleButton = postElement.querySelector('[data-action="click->posts#toggleChecked"]')
    if (toggleButton) {
      toggleButton.textContent = checkedText
    }
  }

  clearForm() {
    this.contentTarget.value = ''
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  showSuccess(message) {
    this.showNotification(message, 'success')
  }

  showError(message) {
    this.showNotification(message, 'error')
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // Add to page
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove()
    }, 3000)
  }
}