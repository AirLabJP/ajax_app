Rails.application.routes.draw do
  root to: 'posts#index'
  
  resources :posts, only: [:index, :show, :create, :update, :destroy] do
    member do
      patch :toggle_checked
    end
  end
end

