# hjg2pdf

Descargue la palabra y sus lecturas en PDF.

## Requerimientos del sistema

```bash
# Fedora
$ sudo dnf install python python-pip wkhtmltopdf
# Mageia
$ sudo dnf install python3 python3-pip wkhtmltopdf
```

## Despliegue

### Instalar pip

```bash
# Fedora
sudo dnf install python-pip
# Mageia
sudo dnf install python3-pip
```

### Instalar virtualenv

```bash
# Fedora
pip install virtualenv
# Mageia
sudo pip3 install virtualenv
```

### Crear entorno virtual

```bash
# Fedora
virtualenv .venv
# Mageia
virtualenv .venv -p python3
```

## Uso

### Activar entorno virtual

```bash
source .venv/bin/activate
```

### Instalar dependencias

```bash
pip install -r requirements.txt
```

### Buscar palabra

```bash
# Fedora
python hjg2pdf.py palabra
# Mageia
python3 hjg2pdf.py palabra
```

### Desactivar entorno virtual

```bash
deactivate
```
