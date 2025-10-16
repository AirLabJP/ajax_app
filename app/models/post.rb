class Post < ApplicationRecord
  validates :content, presence: true, length: { minimum: 1, maximum: 1000 }
  validates :checked, inclusion: { in: [true, false] }

  scope :recent, -> { order(created_at: :desc) }
  scope :checked, -> { where(checked: true) }
  scope :unchecked, -> { where(checked: false) }

  def toggle_checked!
    update!(checked: !checked)
  end
end
