import os
import webbrowser
from threading import Timer
from app import create_app

app = create_app()

def open_browser():
    # Te dirigirá automáticamente a nuestra ruta de comprobación para verificar que todo vive
    webbrowser.open_new('http://127.0.0.1:5000/health')

if __name__ == '__main__':
    # Esta condición asegura que el navegador se abra solo una vez, 
    # ignorando el proceso secundario del modo debug de Flask.
    if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
        Timer(1.25, open_browser).start()
        
    app.run(debug=True, port=5000)