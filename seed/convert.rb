require 'securerandom'
require 'csv'
require 'json'
require 'set'
require 'yaml'

source = CSV.read('./data.csv', headers: true)
category_list = File.read('./categories.txt').lines.map(&:strip)
image_urls = File.read('./image-urls.txt').lines.map(&:strip).map(&:to_s)

def to_cat(cat)
  JSON
    .parse(cat)
    .first
    .gsub(' >> ', '/')
    .gsub('\'', '')
    .gsub('&', 'n')
    .gsub(' ', '_')
    .gsub(/.\(.*\)/, '')
    .downcase
end

now = Time.now.utc.to_s

items = []
statuses = []
images = []
relations = []
categories = []

start_sequence = 0
id_sequence = -> { (start_sequence += 1).to_s }

profiles = [
  { uuid: 'ed034dc5-540e-42ab-9453-75ece6abb7f2', user_id: id_sequence.call, slug: 'yan-seller', name: 'Yan Seller', last_name: 'Yan', first_name: 'Seller' },
  { uuid: 'ffec6d59-76ba-40d7-a0a1-b594c038c058', user_id: id_sequence.call, slug: 'anton-admin', name: 'Anton Admin', last_name: 'Anton', first_name: 'Admin' },
  { uuid: '60593c97-165a-4a52-8e91-e26ae77f1cb8', user_id: id_sequence.call, slug: 'frank-buyer', name: 'Frank Buyer', last_name: 'Frank', first_name: 'Buyer' },
  { uuid: '2c8a51e2-291f-4f0d-94ea-ec010c222fbf', user_id: id_sequence.call, slug: 'ann-random', name: 'Ann Random', last_name: 'Ann', first_name: 'Random' },
  { uuid: '2c8a51e2-291f-4f0d-94ea-ec010c222fbc', user_id: id_sequence.call, slug: 'roy-lurker', name: 'Roy Lurker', last_name: 'Roy', first_name: 'Lurker' }
]

categories = category_list.map { |c| { key: c, uuid: SecureRandom.uuid } }

source.take(5000).map do |row|
  uuid = SecureRandom.uuid

  item = row.to_h.slice('name', 'description', 'type', 'price')
  item['price'] = row['price'].to_f < 1000 ? 1099 : row['price'].to_f
  item['category'] = category_list.sample
  item['uuid'] = uuid
  item['owner'] = profiles[0][:user_id]
  item['cover_photo_url'] = image_urls.sample
  item['_id'] = id_sequence.call
  item['c__status'] = 'app.statuses.items.published'

  items << item

  statuses << { profile_id: item['owner'],
                object_id: item['_id'],
                fullname: 'app.statuses.items.published',
                scope: 'app.statuses.items',
                name: 'published',
                timestamp: now
  }
end

output = CSV.generate do |csv|
  csv << %w[properties model_schema created_at updated_at id]

  profiles.each do |profile|
    csv << [profile.to_json, 'profile', now, now, profile[:user_id]]
  end

  items.each do |item|
    csv << [item.to_json, 'item', now, now, item['_id']]
  end

  statuses.each do |item|
    csv << [item.to_json, 'status', now, now, id_sequence.call]
  end

  images.each do |item|
    csv << [item.to_json, 'item_photo', now, now, id_sequence.call]
  end

  categories.each do |item|
    csv << [item.to_json, 'category', now, now, id_sequence.call]
  end
end

File.open('./models.csv', 'w') do |f|
  f.puts output
end
