require 'sinatra'
set :public_folder, File.dirname(__FILE__) + '/app'
get "/" do
	send_file "app/index.html"
end

get "/manifest.appcache" do
	send_file "app/manifest.appcache", :type => "text/cache-manifest"
end
