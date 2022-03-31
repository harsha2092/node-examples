import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    email: string;
    
    @Column()
    password: string;

    @AfterInsert()
    logInsert(){
        console.log(`user with id: ${this.id} is inserted`);
    }

    @AfterUpdate()
    logUpdate(){
        console.log(`user with id: ${this.id} is updated`);
    }

    @AfterRemove()
    logRemove(){
        console.log(`user with id: ${this.id} is removed`);
    }
}