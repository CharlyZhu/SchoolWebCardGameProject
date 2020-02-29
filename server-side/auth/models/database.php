<?php 
	class Database {
		private $conn;
		private $database_info = array (
			"address" => "localhost",
			"username" => "root",
			"password" => "",
			"name" => "emp_games_eu",
			"port" => "3306"
		);
		
		private function connect() {
			$this->conn = mysqli_connect($this->database_info["address"], $this->database_info["username"], $this->database_info["password"], $this->database_info["name"], $this->database_info["port"]);

			if (mysqli_connect_errno($this->conn))
			    echo "连接 MySQL 失败: " .mysqli_connect_error();

			mysqli_set_charset($this->conn, "utf8");
			return $this->conn;
		}

        public function getConnection() {
            if (mysqli_connect_errno($this->conn)) {
                echo "连接 MySQL 失败: " .mysqli_connect_error();
                $this->conn = null;
            }

		    if ($this->conn == null)
		        return $this->connect();

		    return $this->connect();
        }
	}

	$GLOBALS['database'] = new Database();
