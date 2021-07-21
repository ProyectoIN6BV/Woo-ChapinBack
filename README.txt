RUTAS ESPECIFICAS SEGÚN HOJA DE RUBRICA
---------------------------------------------------

--------------------
CATEGORÍA
-------------------

-LADO ADMINISTRADOR
    AgregarCategoria
    1. localhost:3800/carrito/createCategory MÉTODO POST ---- PARAMETROS(nameCategoria,descCategoria)
    
    ActualizarCategoria
    2. localhost:3800/carrito/updateCategory/(idCategoria) MÉTODO PUT ---- PARAMETROS(puede ser nameCategoria o descCategoria)- 
    no dejara guardar si hay una categoria con nombre igual

    EliminarCategoria
    3.localhost:3800/carrito/deleteCategory/(idCategoria) MÉTODO DELETE -- productos asignados se modifican a DEFAULT

    verCategorias
    4. localhost:3800/carrito/getCategory     MÉTODO geT

    categoria default se crea cuando se inicializa el servidor

- LADO CLIENTE
    verCategorias
    1. localhost:3800/carrito/getCategory     MÉTODO geT
    
    PRODUCTOS POR CATEGORIA
    2. localhost:3800/carrito/searchProduct/  MÉTODO POST params(search) ---- busca por nombre de categoria( search product es una misma funcion, busca por nombre, id, categoria)

-------------------------
    PRODUCTOS
-------------------------

- LADO ADMINISTRADOR
    crear producto
    1. localhost:3800/carrito/createProduct MÉTODO POST  params (nameProducto, descProducto, precio,categoria,stock) (categoria es el id)
    no dejará guardar si hay un producto con el mismo nombre

    update producto
    2. localhost:3800/carrito/updateProduct/(idproducto) MÉTODO PUT params(pueden ser los mencionados en crear producto) 
    no dejará actualizar si el nombre del producto ya se encuentra en uso

    eliminar producto
    3. localhost:3800/carrito/deleteProduct/(idproducto) MÉTODO DELETE

    ver productos
    4. localhost:3800/carrito/getProducts MÉTODO GET

    
    productos más vendidos
    5. localhost:3800/carrito/bestSellers método get 

    productos agotados
    6.localhost:3800/carrito/productosAgotados MÉTODO GET

    CONTROL DE stock
        ver stock
    7. localhost:3800/carrito/viewStock/(productoid) MÉTODO GET - se ve el stock que se tiene el producto
        actualizar stock
    8. localhost:3800/carrito/updateStock/(productoid) MÉTODO PUT -- PARAMETROS(STOCK) 

    buscar productos
    9. localhost:3800/carrito/searchProduct/  MÉTODO POST params(search) ---- 
    busca por nombre de categoria( search product es una misma funcion, busca por nombre, id, categoria)

-lado CLIENTE
    productos más vendidos
    1. localhost:3800/carrito/bestSellers método get 

    buscar productos
    2. localhost:3800/carrito/searchProduct/  MÉTODO POST params(search) ---- 
    busca por nombre de categoria( search product es una misma funcion, busca por nombre, id, categoria)


-----------------------------
    FACTURAS
------------------------------
-LADO ADMINISTRADOR
    facturas por usuario
    1.localhost:3800/carrito/(userId)/buscarFacturaUsuario --- MÉTODO GET solo administradores pueden ver esto

    verFacturas
    2.localhost:3800/carrito/verFacturas MÉTODO GET

    verFacturasProductos
    3.localhost:3800/carrito/(facturaId)/buscarFacturaProductos MÉTODO GET

-LADO CLIENTE
    hacer factura
    1.localhost:3800/carrito/(userId)/crearFactura -- aca muestra la factura detallada al momento de crearla
    hacer facturas puede hacer admin como cliente ya que es un usuario y el admin tendría que tener acceso a dicha función

    agregarproducto a carrito
    2.localhost:3800/carrito/(userId)/agregarCarrito/(productoId) - MÉTODO POST PARAMS(cantidad)- si vuelve a agregar el mismo
    producto actualiza la cantidad o si quiere agregar otro producto agrega otro detalle, así lo maneje yo

    eliminar una unidad del carrito
    3. localhost:3800/carrito/(userId)/deleteProductoCarrito/(productoId) - MÉTODO DELETE , ejemplo si el producto tiene 2 cantidades
    lo actualiza a 1 y si llega a tener 0 elimina el detalle

    eliminar todo el producto del carrito
    4. localhost:3800/carrito/(userId)/deleteProductoCompletoCarrito/(productoId) - MÉTODO DELETE , elimina el producto 
    completamente sin importar la cantidad

    ver carrito
    5. localhost:3800/carrito/(userId)/viewCarrito - MÉTODO GET

---------------------------
    USUARIOS
---------------------------
    -lado administradores
        agregar usuario
        1. localhost:3800/carrito/registrarUsuario MÉTODO POST PARAMS(name, lastName, userName, password,email,phone)
        modificar role
        2. localhost:3800/carrito/modificarRole/(userId) MÉTODO PUT - PARAMS (role) debe de ingresar un valor valido
        ROLE_ADMIN o ROLE_CLIENTE

    -LADO CLIENTE
        registrarUsuario
        1. localhost:3800/carrito/registrarUsuario MÉTODO POST PARAMS(name, lastName, userName, password,email,phone)
        eliminar cuenta
        2. localhost:3800/carrito/deleteAccount/(userId) MÉTODO DELETE PARAMS password
        modificar cuenta
        3. localhost:3800/carrito/editAccount/(userId) MÉTODO PUT PARAMS mencionados en registrar usuario

        eliminar y modificar cuenta sirven para administrador también porque al final de cuentas es un usuario.
        
    
