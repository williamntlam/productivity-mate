package com.williamntlam.taskmanagementapp.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Component
public class Db {

    private final DataSource dataSource;

    @Autowired
    public Db(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Establish a connection to the PostgreSQL database.
     *
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */

    @PostConstruct
    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    /**
     * Close a database connection.
     *
     * @param connection The Connection object to close
     */
    public static void closeConnection(Connection connection) {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Failed to close the connection.");
                e.printStackTrace();
            }
        }
    }

}
