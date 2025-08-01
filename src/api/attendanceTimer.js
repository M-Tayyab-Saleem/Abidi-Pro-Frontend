import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../axios";

export const checkInNow = createAsyncThunk(
  'employee/checkin',
  async (_, { rejectWithValue }) => {  // Removed data parameter since we don't need to send userId
    try {
      const response = await api.post('/timetrackers/check-in', {}, {  // Empty body since we're using req.user.id
        withCredentials: true
      });
      console.log(response.data,"success from api slice")
      return response.data;
    } catch (err) {
        console.log(err.response.data,"error from api")
      return rejectWithValue(err.response?.data || "checkInn failed");
    }
  }
);

export const checkOutNow = createAsyncThunk(
  'employee/checkout',
  async (_, { rejectWithValue }) => {  // Removed userId parameter
    try {
      const response = await api.post('/timetrackers/check-out', {}, {  // Empty body
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "checkOut failed");
    }
  }
);

const attendanceTimerSlice=createSlice({
    name:'employee',
    initialState:{
        checkInn:null,
        checkOut:null,
        loading:false,
        error:null,
    },
    reducers:{
      setError(state,action){
        state.error=action.payload
      }
    },
    extraReducers:(builder)=>{
        builder.addCase(checkInNow.pending,(state)=>{
            state.loading=true
            
        }).addCase(checkInNow.fulfilled,(state,action)=>{
            state.loading=false
            state.error=null
            state.checkInn=action.payload
            
        }).addCase(checkInNow.rejected,(state,action)=>{
            state.error=action.payload
            state.loading=false
        }).addCase(checkOutNow.pending,(state)=>{
            state.loading=true
            
        }).addCase(checkOutNow.fulfilled,(state,action)=>{
            state.loading=false
            state.error=null
            state.checkOut=action.payload
            state.checkInn=null
        }).addCase(checkOutNow.rejected,(state,action)=>{
            state.error=action.payload
            state.loading=false 
        })
    }
})
export const { setError } = attendanceTimerSlice.actions;
export default attendanceTimerSlice.reducer