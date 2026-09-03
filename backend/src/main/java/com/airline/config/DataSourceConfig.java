package com.airline.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Builds the DataSource from DATABASE_URL even when Render / Neon give a
 * postgres:// URL (Hikari expects jdbc:postgresql://). Also handles embedded
 * user:pass in the URL so credentials stay in one env var. Without this,
 * Spring would try to open postgres:// as a JDBC URL and crash on Postgres
 * hosts — which is why the previous H2 file fallback was being used and
 * wiped on every sleep/redeploy.
 */
@Configuration
public class DataSourceConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME:}")
    private String databaseUsername;

    @Value("${DATABASE_PASSWORD:}")
    private String databasePassword;

    @Value("${DATABASE_DRIVER:}")
    private String databaseDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = databaseUrl != null ? databaseUrl.trim() : "";
        String username = databaseUsername != null ? databaseUsername.trim() : "";
        String password = databasePassword != null ? databasePassword.trim() : "";
        String driver = databaseDriver != null ? databaseDriver.trim() : "";

        // Local dev — no DATABASE_URL set -> H2 file (kept for offline work)
        if (url.isBlank()) {
            HikariDataSource ds = new HikariDataSource();
            ds.setJdbcUrl("jdbc:h2:file:./data/airline_db;MODE=MySQL;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE");
            ds.setUsername("sa");
            ds.setPassword("");
            ds.setDriverClassName("org.h2.Driver");
            return ds;
        }

        // Render / Neon / Supabase give postgres:// or postgresql:// (not jdbc:*).
        // jdbc:postgresql:// does not allow user:pass@host, so split it out.
        if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
            try {
                URI uri = new URI(url);
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    if (parts.length > 1) password = parts[1];
                }
                String host = uri.getHost();
                int port = uri.getPort();
                String path = uri.getPath() != null ? uri.getPath() : "/airline_db";
                String query = uri.getQuery();

                StringBuilder jdbc = new StringBuilder("jdbc:postgresql://");
                jdbc.append(host);
                if (port != -1) jdbc.append(":").append(port);
                jdbc.append(path);
                if (query != null && !query.isEmpty()) {
                    jdbc.append("?").append(query);
                    if (!query.contains("sslmode")) jdbc.append("&sslmode=require");
                } else {
                    jdbc.append("?sslmode=require");
                }
                url = jdbc.toString();
                driver = "org.postgresql.Driver";
            } catch (Exception e) {
                url = url.replaceFirst("postgres(ql)?://", "jdbc:postgresql://");
                driver = "org.postgresql.Driver";
            }
        } else if (url.startsWith("jdbc:postgresql://") || url.contains("postgresql")) {
            driver = "org.postgresql.Driver";
        } else if (url.startsWith("jdbc:mysql://") || url.contains("mysql")) {
            if (driver.isBlank()) driver = "com.mysql.cj.jdbc.Driver";
        } else if (url.startsWith("jdbc:h2:")) {
            driver = "org.h2.Driver";
        }

        if (driver.isBlank()) {
            driver = url.contains("postgresql") ? "org.postgresql.Driver"
                    : url.contains("mysql") ? "com.mysql.cj.jdbc.Driver"
                    : "org.h2.Driver";
        }

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);
        ds.setDriverClassName(driver);
        // Keep pool small for Render free / Neon
        ds.setMaximumPoolSize(5);
        ds.setMinimumIdle(1);
        return ds;
    }
}
