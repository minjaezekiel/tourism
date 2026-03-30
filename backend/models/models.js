// models/index.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// =======================
// DATABASE CONNECTION
// =======================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// =======================
// USER MODEL (FIXED)
// =======================
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {                     // ✅ FIXED: Added email
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

// =======================
// ANALYTICS MODEL
// =======================
const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'analytics',
  timestamps: true,
  underscored: true
});

// =======================
// BLOG MODEL
// =======================
const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author_id: {                 // ✅ FIXED FK
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'blogs',
  timestamps: true,
  underscored: true
});

// =======================
// CONTACT MODEL
// =======================
const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tour: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'contacts',
  timestamps: true,
  underscored: true
});

// =======================
// GALLERY MODEL
// =======================
const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alt: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Gallery Image"
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'gallery',
  timestamps: true,
  underscored: true
});

// =======================
// TESTIMONIAL MODEL
// =======================
const Testimonial = sequelize.define('Testimonial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'testimonials',
  timestamps: true,
  underscored: true
});

// =======================
// TOUR MODEL
// =======================
const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'tours',
  timestamps: true,
  underscored: true
});

// =======================
// ASSOCIATIONS
// =======================
User.hasMany(Blog, {
  foreignKey: 'author_id',
  as: 'posts'
});

Blog.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

// =======================
// EXPORTS
// =======================
module.exports = {
  sequelize,
  Sequelize,
  User,
  Analytics,
  Blog,
  Contact,
  Gallery,
  Testimonial,
  Tour
};