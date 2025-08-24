export type Category =
  | "adult"
  | "senior"
  | "student"
  | "preschool3plus"
  | "under2"
  | "companion_student_adult"
  | "companion_senior_adult";

export type Tariff = "season_9_6" | "season_7_8" | "evening" | "group";

export type MembershipDuration = "30d" | "6m" | "1y";

export type LineType = "pool" | "gym" | "locker" | "membership" | "coupon";

export type PoolLine = {
  id: string;
  type: "pool";
  tariff: Tariff;
  entries: Array<{
    category: Category;
    count: number;
    disabledDiscount: boolean;
  }>;
};

export type GymLine = {
  id: string;
  type: "gym";
  who: "adult" | "student" | "member_or_pool_user";
  count: number;
};

export type LockerLine = {
  id: string;
  type: "locker";
  count: number;
};

export type MembershipCategory = Extract<Category, "adult" | "senior" | "student">;

export type MembershipLine = {
  id: string;
  type: "membership";
  category: MembershipCategory;
  duration: MembershipDuration;
  count: number;
  disabledDiscount: boolean;
};

export type CouponLine = {
  id: string;
  type: "coupon";
  category: "adult" | "senior" | "student" | "preschool3plus";
  books: number;
};

export type Line = PoolLine | GymLine | LockerLine | MembershipLine | CouponLine;