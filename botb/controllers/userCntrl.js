import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";
 

export const createUser = asyncHandler(async (req, res) => {
  const { username, teleNumber, surname } = req.body;

  try {
    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { teleNumber },
    });

    // If user exists, check for roles and return response
    if (userExists) {
      const email = userExists.email || "";

      if (email.includes("geomap")) {
        return res.status(200).json({
          message: "Agent",
          email: userExists.email,
          user: userExists,
        });
      }

      if (email.includes("david")) {
        return res.status(200).json({
          message: "Admin",
          email: userExists.email,
          user: userExists,
        });
      }

      // Default response if no role matched
      return res.status(200).json({
        message: "Logged in successfully",
        role: "User",
        user: userExists,
      });
    }

    // If user does not exist, create a new user
    const newUser = await prisma.user.create({
      data: {
        username,
        surname,
        teleNumber,
      },
    });

    // Default response for a new standard user
    return res.status(201).json({
      message: "User registered successfully",
      role: "User",
      user: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err.message);
    return res.status(500).json({
      message: "An error occurred while creating the user",
      error: err.message,
    });
  }
});


 
export const likes = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const alreadyLiked = await prisma.user.findUnique({
      where: { email: email },
      select: { favoriteResidency: true },
    });

    if (!alreadyLiked) {
      return res.status(404).json({ message: "User not found" });
    }

    if (alreadyLiked.favoriteResidency.some((visit) => visit.id === id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        favoriteResidency: { push: id },
      },
    });

    res.json("Liked");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to Like" });
  }
});

export const dislikes = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { favoriteResidency: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.favoriteResidency.includes(id)) {
      return res.status(400).json({ message: "Removed like" });
    }

    // Rename the callback parameter to avoid shadowing the outer id.
    const updatedFavorites = user.favoriteResidency.filter(
      (residencyId) => residencyId !== id
    );

    await prisma.user.update({
      where: { email: email },
      data: { favoriteResidency: updatedFavorites },
    });

    console.log("Likes removed successfully.");
    res.json({ message: "Removed likes successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove like" });
  }
});

export const allLikes = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const likes = await prisma.user.findUnique({
      where: { teleNumber: email },
      select: { favoriteResidency: true },
    });
    res.status(200).json(likes.favoriteResidency);
  } catch (err) {
    throw new Error(err.message);
  }
});
export const getusers = asyncHandler(async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to get Users"})
    }
})
export const getuser = asyncHandler(async (req, res) => {
    const {email} = req.body; 
  console.log(email)

    try {
        const user = await prisma.user.findUnique({
            where: {email: email}
        });
        console.log(user)
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to get Users"})
    }
})


export const updateUserEmail = async ( req,res) => {
  const {userId,email} = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        teleNumber: userId,
      },
      data: {
        email: email,
      },
    });
    console.log('User email updated:', updatedUser);
        res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
   
  }
};

export const updateAgent = asyncHandler(async (req, res) => {
  const { teleNumber, username, surname, email } = req.body; 
 

  try {
    const updatedProfile = await prisma.user.update({
      where: { teleNumber },
      data: {
        username,
        surname,
        email
      },
    });
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const { teleNumber, username, surname } = req.body; 
 

  try {
    const updatedProfile = await prisma.user.update({
      where: { teleNumber },
      data: {
        username,
        surname
      },
    });
    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedProfile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const interest = asyncHandler(async (req, res) => {
  const { teleNumber } = req.body;
  const { id } = req.params;
  try {
    const alreadyInterested = await prisma.user.findUnique({
      where: { teleNumber: teleNumber },
      select: { interested: true },
    });


    if (!alreadyInterested) {
      return res.status(404).json({ message: "User not found" });
    }


    if (alreadyInterested.interested.some((interest) => interest.id === id)) {
      return res.status(400).json({ message: "Already liked" });
    }
    await prisma.user.update({
      where: { teleNumber: teleNumber },
      data: {
        interested: { push: id },
      },
    });

    res.json({ message: "interest updated successfully"});
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to interest" });
  }
});
export const removeInterest = asyncHandler(async (req, res) => {
  const { teleNumber } = req.body;
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { teleNumber: teleNumber },
      select: { interested: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.interested.includes(id)) {
      return res.status(400).json({ message: "Removed interest" });
    }
    const updatedInterest = user.interested.filter((id) => id !== id);
    

    await prisma.user.update({
      where: { teleNumber: teleNumber },
      data: { interested: updatedInterest },
    });

    res.json({ message: "removed Interest successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove interest" });
  }
});


export const rentedbyagent = asyncHandler(async (req, res) => {
  const { username, residency, telephoneNumber, codastral, startDate, endDate } = req.body;
  const { id } = req.params;

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        id, // Residency ID or property ID
        residency, // Property title sent from the frontend
        username,
        telephoneNumber,
        codastral,
        startDate,
        endDate,
      },
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
