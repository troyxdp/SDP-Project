import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "../firebase-config/firebase/storage";
import { db } from '../firebase-config/firebase';
import { v4 } from "uuid";