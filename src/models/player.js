module.exports = function(sequelize, DataTypes) {
    const Player = sequelize.define('Player', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        rating: DataTypes.INTEGER,
        handedness: DataTypes.ENUM('left', 'right')
    }, {
        indexes: [
            {
                unique: true,
                fields: ['first_name', 'last_name'],
            }
        ],
        underscored: true,
        freezeTableName: true,
        tableName: 'player',
    });

    Player.associate = function(models) {
        Player.belongsTo(models.User);
    };
    return Player;
};