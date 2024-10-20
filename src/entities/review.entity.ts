// import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
// import { v4 as uuidv4 } from 'uuid';
// import { User } from "./user.entity";
// import { Restaurant } from "./restaurant.entity";

// @Entity("review")
// export class Review {
//     @PrimaryGeneratedColumn()
//     id: string;

//     @Column({ default: 0 })
//     rating: number;

//     @ManyToMany(() => User, (user) => user.reviews)
//     user: User;

//     @ManyToMany(()=> Restaurant, (restaurant) => restaurant.reviews)
//     @JoinTable()
//     restaurant: Restaurant;

// }