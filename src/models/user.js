module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: { type: DataTypes.STRING, unique: true },
        password: DataTypes.STRING,
    }, {
        underscored: true,
        freezeTableName: true,
        tableName: 'user',
    });

    User.associate = function(models) {
        User.hasMany(models.Player);
    };

    return User;
};