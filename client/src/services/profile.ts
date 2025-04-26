import { User } from "@/types/User";
import axios from "axios";

export const getProfile = async () => {
	try {
		const response = await axios.get<User>('/profile')
		if (response.status === 200) {
			return response.data
		}
		return null
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response && error.response.status === 401) {
				return null
			}
		}
		console.error("Error fetching profile:", error)
		return null
	}
}

export const closeSession = async () => {
	try {
		const response = await axios.get("/logout");
		if (response.status === 200) {
			return true
		}
	} catch (error) {
		console.error("Error during logout:", error);
	}
}