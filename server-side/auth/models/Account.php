<?php 
	class Account
	{
		// Public fields.
		public $uid, $name, $createdOn;
		
		// Construct an account based on a query.
		public function __construct($uid, $name, $createdOn)
		{
			$this->uid = $uid;
			$this->name = $name;
			$this->createdOn = $createdOn;
		}
	}