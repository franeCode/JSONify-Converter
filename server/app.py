from flask import Flask, request, send_file, jsonify
import pandas as pd
import os
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def convert_to_json(file_path, header_rows=1, footer_rows=0, encodings=None):
    _, file_extension = os.path.splitext(file_path)
    if file_extension.lower() == '.csv':
        for encoding in encodings:
            try:
                df = pd.read_csv(file_path, skiprows=header_rows-1, skipfooter=footer_rows, encoding=encoding)
                break  # Break out of the loop if successful
            except UnicodeDecodeError:
                continue  # Try the next encoding if decoding fails
        else:
            return None, "Unable to decode CSV file with any encoding"
    # elif file_extension.lower() in ['.xls', '.xlsx']:
    #     for encoding in encodings:
    #         try:
    #             df = pd.read_excel(file_path, skiprows=header_rows-1, skipfooter=footer_rows, encoding=encoding)
    #             break  # Break out of the loop if successful
    #         except UnicodeDecodeError:
    #             continue  # Try the next encoding if decoding fails
    #     else:
    #         return None, "Unable to decode Excel file with any encoding"
    else:
        return None, "Unsupported file format"

    json_data = df.to_dict(orient='records')

    return json_data, None

@app.route('/convert', methods=['POST'])
def convert_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file:
        header_rows = int(request.form.get('headerRows', 0))
        footer_rows = int(request.form.get('footerRows', 0))

        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        encodings = ['utf-8', 'latin1', 'iso-8859-1', 'cp1252']  # List of encodings to try

        json_data, error = convert_to_json(filename, header_rows, footer_rows, encodings)
        if error:
            return jsonify({'error': error}), 400

        try:
            formatted_json_data = json.dumps(json_data, indent=4)
        except Exception as e:
            return jsonify({'error': f'Error formatting JSON data: {str(e)}'}), 500

        return jsonify({'data': formatted_json_data}), 200

if __name__ == '__main__':
    app.run(debug=True)
