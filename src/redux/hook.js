import { useDispatch, useSelector } from 'react-redux';

// Use instead of useDispatch
export const useAppDispatch = () => useDispatch();

// Use instead of useSelector
export const useAppSelector = useSelector;