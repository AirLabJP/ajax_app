class PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy, :toggle_checked]
  before_action :authenticate_user!, except: [:index, :show] if respond_to?(:authenticate_user!)

  def index
    @posts = Post.all.order(created_at: :desc)
  end

  def show
    render json: { post: @post }
  end

  def create
    @post = Post.new(post_params)
    @post.checked = false

    if @post.save
      render json: { post: @post, status: :created }
    else
      render json: { errors: @post.errors.full_messages, status: :unprocessable_entity }
    end
  end

  def update
    if @post.update(post_params)
      render json: { post: @post, status: :ok }
    else
      render json: { errors: @post.errors.full_messages, status: :unprocessable_entity }
    end
  end

  def destroy
    @post.destroy
    render json: { status: :ok }
  end

  def toggle_checked
    @post.update(checked: !@post.checked)
    render json: { post: @post, status: :ok }
  end

  private

  def set_post
    @post = Post.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Post not found' }, status: :not_found
  end

  def post_params
    params.require(:post).permit(:content)
  end
end