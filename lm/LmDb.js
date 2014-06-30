/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0 license
 */

/*
import org.h2.jdbcx.JdbcConnectionPool;

private static volatile JdbcConnectionPool cp;
private static volatile int maxActiveConnections;
*/

function Connect() {

}

function Init() {
    /*
    long maxCacheSize = Nxt.getIntProperty("nxt.dbCacheKB");
    if (maxCacheSize == 0) {
        maxCacheSize = Runtime.getRuntime().maxMemory() / (1024 * 2);
    }
    String dbUrl = Constants.isTestnet ? Nxt.getStringProperty("nxt.testDbUrl") : Nxt.getStringProperty("nxt.dbUrl");
    if (! dbUrl.contains("CACHE_SIZE=")) {
        dbUrl += ";CACHE_SIZE=" + maxCacheSize;
    }
    Logger.logDebugMessage("Database jdbc url set to: " + dbUrl);
    cp = JdbcConnectionPool.create(dbUrl, "sa", "sa");
    cp.setMaxConnections(Nxt.getIntProperty("nxt.maxDbConnections"));
    cp.setLoginTimeout(Nxt.getIntProperty("nxt.dbLoginTimeout"));
    int defaultLockTimeout = Nxt.getIntProperty("nxt.dbDefaultLockTimeout") * 1000;
    try (Connection con = cp.getConnection();
         Statement stmt = con.createStatement()) {
        stmt.executeUpdate("SET DEFAULT_LOCK_TIMEOUT " + defaultLockTimeout);
    } catch (SQLException e) {
        throw new RuntimeException(e.toString(), e);
    }
    DbVersion.init();
    */
}

function Shutdown() {
    /*
    if (cp != null) {
        try (Connection con = cp.getConnection();
             Statement stmt = con.createStatement()) {
            stmt.execute("SHUTDOWN COMPACT");
            Logger.logMessage("Database shutdown completed");
        } catch (SQLException e) {
            Logger.logDebugMessage(e.toString(), e);
        }
        //cp.dispose();
        cp = null;
    }
    */
}

function GetConnection() {
    /*
    Connection con = cp.getConnection();
    con.setAutoCommit(false);
    int activeConnections = cp.getActiveConnections();
    if (activeConnections > maxActiveConnections) {
        maxActiveConnections = activeConnections;
        Logger.logDebugMessage("Database connection pool current size: " + activeConnections);
    }
    return con;
    */
}


exports.Connect = Connect;
exports.GetConnection = GetConnection;
exports.Init = Init;
exports.Shutdown = Shutdown;
