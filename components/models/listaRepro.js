module.exports =  (sequelize, DataTypes) => {
    const ListaRepro = sequelize.define('ListaRepro', {
        listaID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        nomeLista: {
            type: DataTypes.STRING,
            allownull: false
        }

        
    });
  
    ListaRepro.associate = (models) => {
        ListaRepro.hasMany(models.ListasMusicas, {
            foreignKey: 'listaFK'
        });

   };
    return ListaRepro;
  };