from flask import Flask, request, send_file,jsonify
from flask_cors import CORS
import dropbox
import tempfile

app = Flask(__name__)
CORS(app) 
access_token = 'your_access_token'

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = file.filename
    file_path = "/"+filename
    dbx = dropbox.Dropbox(access_token)
    dbx.files_upload(file.read(), file_path)
    return 'Upload completed.'

@app.route('/download', methods=['GET'])
def download():
    filename = request.args.get('filename')
    file_path = "/"+filename
    dbx = dropbox.Dropbox(access_token)
    _, f = dbx.files_download(file_path)
    
    with tempfile.NamedTemporaryFile() as temp_file:
        temp_file.write(f.content)
        temp_file.flush()
        return send_file(temp_file.name, mimetype='application/json', as_attachment=True, attachment_filename=filename)

@app.route('/files', methods=['GET'])
def list_files():
    path =""
    dbx = dropbox.Dropbox(access_token)
    response = dbx.files_list_folder(path)
    files = [entry.name for entry in response.entries if isinstance(entry, dropbox.files.FileMetadata)]
    return jsonify(files)  

if __name__ == '__main__':
    app.run()