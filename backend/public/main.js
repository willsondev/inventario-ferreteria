document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const productoForm = document.getElementById('producto-form');
    const uploadForm = document.getElementById('upload-form');
    const categoriaSelect = document.getElementById('categoria');
    const proveedorSelect = document.getElementById('proveedor');
    const agregarCategoriaBtn = document.getElementById('agregar-categoria');
    const agregarProveedorBtn = document.getElementById('agregar-proveedor');
    const productosTable = document.getElementById('productos-table');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const eliminarCategoriaBtn = document.getElementById('eliminar-categoria');
    const filtroProveedor = document.getElementById('filtro-proveedor');
    const eliminarProveedorBtn = document.getElementById('eliminar-proveedor');
    const filtrarButton = document.getElementById('filtrar');
    const buscarInput = document.getElementById('buscar');

    // Función para realizar la búsqueda dinámica de productos
    const buscarProductos = async () => {
        const searchTerm = buscarInput.value.trim().toLowerCase();
        try {
            const res = await fetch(`/api/productos/buscar?query=${encodeURIComponent(searchTerm)}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const productos = await res.json();
            productosTable.innerHTML = ''; // Limpiar la tabla antes de agregar datos
            productos.forEach(producto => {
                const row = productosTable.insertRow();
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad} unidades</td>
                    <td>${producto.categoria && producto.categoria.nombre}</td>
                    <td>${producto.proveedor && producto.proveedor.nombre}</td>
                `;
                productosTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error al buscar productos:', error);
        }
    };

    // Funciones para cargar datos desde el servidor
    const cargarCategorias = async () => {
        try {
            const res = await fetch('/api/categorias');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const categorias = await res.json();
            filtroCategoria.innerHTML = '<option value="">Todas las Categorías</option>';
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria._id;
                option.textContent = categoria.nombre;
                filtroCategoria.appendChild(option);
                const categoriaOption = option.cloneNode(true);
                categoriaSelect.appendChild(categoriaOption);
            });
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    };

    const cargarProveedores = async () => {
        try {
            const res = await fetch('/api/proveedores');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const proveedores = await res.json();
            filtroProveedor.innerHTML = '<option value="">Todos los Proveedores</option>';
            proveedorSelect.innerHTML = '<option value="">Seleccione un proveedor</option>';
            proveedores.forEach(proveedor => {
                const option = document.createElement('option');
                option.value = proveedor._id;
                option.textContent = proveedor.nombre;
                filtroProveedor.appendChild(option);
                proveedorSelect.appendChild(option.cloneNode(true)); // Clone the node for select element
            });
        } catch (error) {
            console.error('Error al cargar los proveedores:', error);
        }
    };

    const cargarProductos = async (query = '') => {
        try {
            const res = await fetch(`/api/productos/filtrar${query}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const productos = await res.json();
            productosTable.innerHTML = ''; // Limpiamos la tabla antes de agregar los datos
            productos.forEach(producto => {
                const row = productosTable.insertRow();
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad} unidades</td>
                    <td>${producto.categoria && producto.categoria.nombre}</td>
                    <td>${producto.proveedor && producto.proveedor.nombre}</td>
                `;
                productosTable.appendChild(row);
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    };

    // Funciones para manipular elementos del DOM
    const agregarCategoria = async () => {
        const nombre = prompt('Ingrese el nombre de la nueva categoría:');
        if (!nombre) return;

        try {
            const res = await fetch('/api/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre })
            });
            const nuevaCategoria = await res.json();
            const option = document.createElement('option');
            option.value = nuevaCategoria._id;
            option.textContent = nuevaCategoria.nombre;
            categoriaSelect.appendChild(option);
            const filtroOption = option.cloneNode(true);
            filtroCategoria.appendChild(filtroOption);
        } catch (error) {
            console.error('Error al agregar nueva categoría:', error);
        }
    };

    const agregarProveedor = async () => {
        const nombre = prompt('Ingrese el nombre del nuevo proveedor:');
        const contacto = prompt('Ingrese el contacto del nuevo proveedor:');
        const direccion = prompt('Ingrese la dirección del nuevo proveedor:');
        if (!nombre || !contacto) return;

        try {
            const res = await fetch('/api/proveedores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, contacto, direccion })
            });
            const nuevoProveedor = await res.json();
            const option = document.createElement('option');
            option.value = nuevoProveedor._id;
            option.textContent = nuevoProveedor.nombre;
            proveedorSelect.appendChild(option);
            const filtroOption = option.cloneNode(true);
            filtroProveedor.appendChild(filtroOption);
        } catch (error) {
            console.error('Error al agregar nuevo proveedor:', error);
        }
    };

    // Funciones para manejar eventos y acciones
    const eliminarProveedor = async () => {
        const proveedorId = filtroProveedor.value;
        if (!proveedorId) {
            alert('Selecciona un proveedor para eliminar.');
            return;
        }

        try {
            const res = await fetch(`/api/proveedores/${proveedorId}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            alert('Proveedor eliminado correctamente');
            cargarProveedores(); // Actualizar la lista de proveedores después de la eliminación
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            alert('Error al eliminar el proveedor. Consulta la consola para más detalles.');
        }
    };

    eliminarProveedorBtn.addEventListener('click', eliminarProveedor);
    cargarProveedores();

    eliminarCategoriaBtn.addEventListener('click', async () => {
        const categoriaId = filtroCategoria.value;
        if (!categoriaId) {
            alert('Selecciona una categoría para eliminar.');
            return;
        }

        try {
            const res = await fetch(`/api/categorias/${categoriaId}`, {
                method: 'DELETE'
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            alert('Categoría eliminada correctamente.');
            cargarCategorias();
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
            alert('Error al eliminar la categoría. Consulta la consola para más detalles.');
        }
    });

    // Event listener para el botón de buscar productos
    buscarInput.addEventListener('input', buscarProductos);

    // Event listener para el botón de filtrar productos
    filtrarButton.addEventListener('click', () => {
        const categoria = filtroCategoria.value;
        const proveedor = filtroProveedor.value;
        let query = '';

        if (categoria) {
            query += `?categoria=${categoria}`;
        }
        if (proveedor) {
            query += `${query ? '&' : '?'}proveedor=${proveedor}`;
        }

        cargarProductos(query);
    });

    // Event listener para el formulario de productos
    productoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const cantidad = document.getElementById('cantidad').value;
        const categoria = document.getElementById('categoria').value;
        const proveedor = document.getElementById('proveedor').value;

        try {
            await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, descripcion, precio, cantidad, categoria, proveedor })
            });

            productoForm.reset();
            cargarProductos();
        
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });

    // Función para subir un archivo Excel
    const subirArchivo = async (formData) => {
        try {
            await fetch('/api/productos/importar', {
                method: 'POST',
                body: formData
            });

            uploadForm.reset();
            cargarProductos();
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    };

    // Event listener para el formulario de subir archivo Excel
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        await subirArchivo(formData);
    });

    // Event listeners para agregar categoría y proveedor
    agregarCategoriaBtn.addEventListener('click', agregarCategoria);
    agregarProveedorBtn.addEventListener('click', agregarProveedor);

    // Cargar categorías, proveedores y productos al iniciar la página
    cargarCategorias();
    cargarProveedores();
    cargarProductos();
});
