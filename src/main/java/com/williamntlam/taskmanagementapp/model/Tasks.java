package com.williamntlam.taskmanagementapp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "Tasks")
public class Tasks {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    

}
