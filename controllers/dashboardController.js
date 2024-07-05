const connection = require('../config/db');


exports.checkUserRoles = (req, res, next) => {
    if (req.session.loggedin) {
        const userId = req.session.userId;

        // Obtener los roles del usuario
        exports.getUserRoles(userId)
            .then(roles => {
                // Verificar si el usuario tiene un rol permitido
                const allowedRoles = ['Administrador', 'Gerente', 'Supervisor'];
                const hasAllowedRole = roles.some(role => allowedRoles.includes(role));

                if (hasAllowedRole) {
                    req.session.roles = roles;
                    next(); // Continuar con la siguiente middleware o ruta
                } else {
                    res.render('error', {
                        message: 'No tienes permiso para acceder'
                    });
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Error al verificar los roles');
            });
    } else {
        res.render('login', {
            companyName: 'Cloup_co',
            companyDescription: 'Somos una empresa dedicada a la venta de productos en línea.',
            name: '',
            login: false
        });
    }
};

exports.getUserRoles = (userId) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT r.nombre AS rol ' +
            'FROM usuarios_roles ur ' +
            'JOIN roles r ON ur.rol_id = r.id ' +
            'WHERE ur.usuario_id = ?', [userId], (error, roles) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(roles.map(role => role.rol));
                }
            });
    });
};

exports.getTotalSales = async (dateRange) => {
    console.log('Valor de dateRange en getTotalSales:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_total_sales(?, ?)', [dateRange.startDate, dateRange.endDate], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const totalSales = result[0][0].total_ventas;
          resolve(totalSales);
        }
      });
    });
  };
  
  exports.getOrderCount = async (dateRange) => {
    console.log('Valor de dateRange en getOrderCount:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_order_count(?, ?)', [dateRange.startDate, dateRange.endDate], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const orderCount = result[0][0].total_pedidos;
          resolve(orderCount);
        }
      });
    });
  };
  
  exports.getTopSellingProducts = async (dateRange) => {
    console.log('Valor de dateRange en getTopSellingProducts:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_top_selling_products()', (error, result) => {
        if (error) {
          reject(error);
        } else {
          const topProducts = result[0].map(product => product.nombre);
          resolve(topProducts);
        }
      });
    });
  };
  
  exports.getAverageOrderValue = async (dateRange) => {
    console.log('Valor de dateRange en getAverageOrderValue:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_average_order_value(?, ?)', [dateRange.startDate, dateRange.endDate], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const averageOrderValue = result[0][0].ingreso_promedio_pedido;
          resolve(averageOrderValue);
        }
      });
    });
  };
  
  exports.getTopSellingCategories = async (dateRange) => {
    console.log('Valor de dateRange en getTopSellingCategories:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_top_selling_categories(?, ?, ?)', [dateRange.startDate, dateRange.endDate, dateRange.limit], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const topCategories = result[0].map(category => category.categoria);
          resolve(topCategories);
        }
      });
    });
  };
  
  exports.getAverageCartValue = async (dateRange) => {
    console.log('Valor de dateRange en getAverageCartValue:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_average_cart_value(?, ?)', [dateRange.startDate, dateRange.endDate], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const averageCartValue = result[0][0].valor_carrito_promedio;
          resolve(averageCartValue);
        }
      });
    });
  };
  
  exports.getNewRecurringCustomers = async (dateRange) => {
    console.log('Valor de dateRange en getNewRecurringCustomers:', dateRange);
    return new Promise((resolve, reject) => {
      connection.query('CALL sp_get_new_vs_recurring_customers(?, ?)', [dateRange.startDate, dateRange.endDate], (error, result) => {
        if (error) {
          reject(error);
        } else {
          const newCustomers = result[0][0].clientes_nuevos;
          const recurringCustomers = result[0][0].clientes_recurrentes;
          resolve({ newCustomers, recurringCustomers });
        }
      });
    });
  };
  function getDateRange(dateRange) {
    const currentDate = new Date();
    let startDate, endDate;
  
    switch (dateRange) {
      case 'lastMonth':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        break;
      case 'lastSemester':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case 'lastQuarter':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case 'lastYear':
        startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        endDate = currentDate;
        break;
    }
  
    return {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      limit: 5 // Límite de categorías a mostrar
    };
  }

  exports.updateSalesData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const totalSales = await exports.getTotalSales(dateRange);
    res.json({ totalSales });
  };
  
  exports.updateOrderData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const orderCount = await exports.getOrderCount(dateRange);
    res.json({ orderCount });
  };
  
  exports.updateTopProductsData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const topProducts = await exports.getTopSellingProducts(dateRange);
    res.json({ topProducts });
  };
  
  exports.updateAverageOrderData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const averageOrderValue = await exports.getAverageOrderValue(dateRange);
    res.json({ averageOrderValue });
  };
  
  exports.updateTopCategoriesData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const topCategories = await exports.getTopSellingCategories(dateRange);
    res.json({ topCategories });
  };
  
  exports.updateAverageCartData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const averageCartValue = await exports.getAverageCartValue(dateRange);
    res.json({ averageCartValue });
  };
  
  exports.updateCustomerData = async (req, res) => {
    const dateRange = req.body.dateRange;
    const { newCustomers, recurringCustomers } = await exports.getNewRecurringCustomers(dateRange);
    res.json({ newCustomers, recurringCustomers });
  };

  // controllers/dashboardController.js

exports.getDashboardData = async (req, res) => {
    const dateRange = getDateRange(
      req.query.salesDateRange || 'lastMonth',
      req.query.orderDateRange || 'lastMonth',
      req.query.topProductsDateRange || 'lastMonth',
      req.query.averageOrderDateRange || 'lastMonth',
      req.query.topCategoriesDateRange || 'lastMonth',
      req.query.averageCartDateRange || 'lastMonth',
      req.query.customerDateRange || 'lastMonth'
    );
  
    console.log('Valor de dateRange antes de ser usado:', dateRange);
  
    const totalSales = await exports.getTotalSales(dateRange);
    console.log('Valor de dateRange en getTotalSales:', dateRange);
    console.log('Total Sales:', totalSales);
  
    const orderCount = await exports.getOrderCount(dateRange);
    console.log('Valor de dateRange en getOrderCount:', dateRange);
    console.log('Order Count:', orderCount);
  
    const topSellingProducts = await exports.getTopSellingProducts(dateRange);
    console.log('Valor de dateRange en getTopSellingProducts:', dateRange);
    console.log('Top Selling Products:', topSellingProducts);
  
    const averageOrderValue = await exports.getAverageOrderValue(dateRange);
    console.log('Valor de dateRange en getAverageOrderValue:', dateRange);
    console.log('Average Order Value:', averageOrderValue);
  
    const topSellingCategories = await exports.getTopSellingCategories(dateRange);
    console.log('Valor de dateRange en getTopSellingCategories:', dateRange);
    console.log('Top Selling Categories:', topSellingCategories);
  
    const averageCartValue = await exports.getAverageCartValue(dateRange);
    console.log('Valor de dateRange en getAverageCartValue:', dateRange);
    console.log('Average Cart Value:', averageCartValue);
  
    const { newCustomers, recurringCustomers } = await exports.getNewRecurringCustomers(dateRange);
    console.log('Valor de dateRange en getNewRecurringCustomers:', dateRange);
    console.log('New Customers:', newCustomers);
    console.log('Recurring Customers:', recurringCustomers);
  
    console.log('Valor de dateRange después de ser usado:', dateRange);
  
    res.render('dashboard', {
      totalSales,
      orderCount,
      topSellingProducts,
      averageOrderValue,
      topSellingCategories,
      averageCartValue,
      newCustomers,
      recurringCustomers
    });
  };
  