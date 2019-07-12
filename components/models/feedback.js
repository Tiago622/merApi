module.exports =  (sequelize, DataTypes) => {
    const Feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        feedback: {
            type: DataTypes.BOOLEAN,
            allownull: false
        }
    });
  
 
    Feedback.associate = (models) => {
        Feedback.belongsTo(models.User, {
            foreignKey: 'userFK',
        });

        Feedback.belongsTo(models.Music, {
            foreignKey: 'musicFK',
        });
    };

    
    return Feedback;
  };