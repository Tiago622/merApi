module.exports = (sequelize, DataTypes) => {
    const Music = sequelize.define('Music', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        idVideo: {
            type: DataTypes.STRING,
            allownull: false
        },
        name: {
            type: DataTypes.STRING,
            allownull: false
        },
        url: {
            type: DataTypes.STRING,
            allownull: false
        },
        emocao: {
            type: DataTypes.STRING,
            allownull: false
        }
    });
        Music.associate = (models) => {
         Music.hasMany(models.Feedback, {
             foreignKey: 'musicFK',onDelete: 'cascade',
             hooks: true, 
         });
    
         Music.hasMany(models.ListasMusicas, {
            foreignKey: 'musicFK',onDelete: 'cascade',
            hooks: true, 
        });
   
    };


    return Music;
};