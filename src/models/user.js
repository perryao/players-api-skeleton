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
        instanceMethods: {
            toJSON: function () {
                
            },
        }
    });

    // patch toJSON to exclude password
    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    };

    User.associate = function(models) {
        User.hasMany(models.Player);
    };

    return User;
};