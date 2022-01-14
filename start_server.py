from http.server import HTTPServer, SimpleHTTPRequestHandler


def main():
	server_address = ('localhost', 8080)
	handler = SimpleHTTPRequestHandler
	server = HTTPServer(server_address, handler)
	print("Serving at",server_address)
	try:
		server.serve_forever()
	except KeyboardInterrupt:
		server.socket.close()

if __name__ == '__main__':
	main()
	
	
