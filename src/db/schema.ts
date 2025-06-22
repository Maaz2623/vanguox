import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
  decimal,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const sellerAccount = pgTable("seller_account", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  isEnabled: boolean("is_enabled").default(true),
  upiId: text("upi_id").notNull(),
  bankAccountHolderName: text("bank_account_holder_name").notNull(),
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  name: text("name").notNull().unique(), // enforce slug uniqueness

  category: text("category").notNull(),

  description: text("description").notNull(),

  email: text("email").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const sizes = pgTable("sizes", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  name: text("name").notNull(), // e.g., "Small", "Large"
  value: text("value").notNull(), // e.g., "S", "L"

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const colors = pgTable("colors", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  name: text("name").notNull(),
  value: text("value").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, {
      onDelete: "cascade",
    }),

  name: text("name").notNull(),

  description: text("description"),

  category: text("category").notNull(),

  price: decimal("price", { precision: 10, scale: 2 }).notNull(),

  stockQuantity: integer("stock_quantity").notNull(),

  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),

  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),

  url: text("url").notNull(), // direct link to the image (S3, Cloudinary, etc.)
  alt: text("alt").default(""), // alternative text for accessibility / SEO
  priority: integer("priority").default(0), // used for ordering images

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const wishlist = pgTable("wishlist", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),

  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),

  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, {
      onDelete: "cascade",
    }),
  cartId: uuid("cart_id")
    .references(() => cart.id, {
      onDelete: "cascade",
    })
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id, {
      onDelete: "cascade",
    })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),

  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  cartId: uuid("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "set null" }), // in case you want to preserve order even if cart is deleted

  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),

  status: orderStatusEnum("order_status").default("pending").notNull(),

  razorpayId: text("razorpay_id"),

  notes: text("notes"),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),

  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  orderId: varchar("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "restrict" }),

  storeId: uuid("store_id")
    .notNull()
    .references(() => stores.id, {
      onDelete: "cascade",
    }),

  quantity: integer("quantity").notNull(),

  priceAtPurchase: decimal("price_at_purchase", {
    precision: 10,
    scale: 2,
  }).notNull(),

  // ✅ Add this
  isSettled: boolean("is_settled").default(false).notNull(),

  // (Optional) delivery timestamp
  deliveredAt: timestamp("delivered_at"),
});

export const sellerWallet = pgTable("seller_wallet", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .unique()
    .notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),

  walletId: uuid("wallet_id")
    .references(() => sellerWallet.id, { onDelete: "cascade" })
    .notNull(),

  type: text("type").notNull(), // "credit" or "debit"

  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),

  reason: text("reason"), // e.g. "order payment", "manual update"

  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "processing",
  "processed",
  "failed",
  "cancelled",
]);

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  razorpayPayoutId: text("razorpay_payout_id"),
  status: withdrawalStatusEnum("withdrawal_status")
    .default("processing")
    .notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const razorpayFundAccounts = pgTable("razorpay_fund_accounts", {
  id: uuid("id").primaryKey().defaultRandom(), // ✅ or defaultFn: uuid
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  contactId: text("contact_id").notNull(),
  fundAccountId: text("fund_account_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
