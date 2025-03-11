import { Router } from 'express';
import { getUser, loginUser, registerUser } from '../controllers/user-controller';

const router = Router();

router.get('/', getUser);
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;