from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer


PORT = 8090


class CassandraHandler(SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        SimpleHTTPRequestHandler.end_headers(self)


server = TCPServer(("0.0.0.0", PORT), CassandraHandler)

print("Cassandra server started on port 8090")

server.serve_forever()