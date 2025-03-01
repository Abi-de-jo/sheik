import asyncHandler from "express-async-handler";
import { prisma } from "../lib/prisma.js";

export const createResidency = asyncHandler(async (req, res) => {
  console.log(req.body.secondFormData)

  const {
    title,
    address,
    metro,
    district,
    price,
    discount,
    currency,
    commission,
    propertyType,
    selectedAdditional,
    residencyType,
    termDuration,
        business,

    term,
    rooms,
    city,
    addressURL,
    area,
    heating,
    type,
    parking,
    bathrooms,
    design,
    paymentMethod,
    googleaddressurl,
        taxOption,
    floor,
    totalFloors,
    balcony,
    amenities,
    name,
    phone,
    position,
    deposit,
    description,
    video,
    images, // Ensure this is an array
  } = req.body.secondFormData;


  const userTeleNumber = req.body.teleNumber;
  const email = req.body.email;
  
  // Log the incoming request to verify structure
  console.log("Request body:", req.body);
 
  // Validate input
  if (!userTeleNumber) {
    return res.status(400).json({ message: "User email is required." });
  }

  // Ensure images is an array
  const imageArray = Array.isArray(images) ? images : [];

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        address,
        metro,
        district,
        price,
        selectedAdditional,
        discount,
        commission,
        paymentMethod,
        currency,
        propertyType,
        design,
        residencyType,
            business,

        heating,
        rooms,
        termDuration,
        term,
        name,
    phone,
            taxOption,

        bathrooms,
        floor,
        totalFloors,
        area,
        type,
        parking,
        city,
        position,
        deposit: parseInt(deposit),
       email,
        addressURL,
        googleaddressurl,
        balcony,
        amenities,
        description,
        video,
        status: "draft",
        images: imageArray,
        userTeleNumber, // Relates the residency to the user via userEmail
      },
    });

    return res.json({ message: "Residency created successfully", residency });
  } catch (err) {
    console.error("Error creating residency:", err);

    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "A residency with this address already exists." });
    }

    return res.status(500).json({ message: err.message });
  }

  console.log(req.body);
});
export const getAllResidency = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      where: { status: "published" },

      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});
export const getAll = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
 
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});
export const getAllRentedResidency = asyncHandler(async (req, res) => {
  const {teleNumber} = req.body;
  try {
    const residencies = await prisma.residency.findMany({
      where: { teleNumber:teleNumber,status: "rented" },

      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});
export const getAllAgentPublishedResidency = asyncHandler(async (req, res) => {
  const {teleNumber} = req.body;
  try {
    const residencies = await prisma.residency.findMany({
      where: { teleNumber:teleNumber,status: "publish" },

      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});
export const getAllArchievedResidency = asyncHandler(async (req, res) => {
  const {teleNumber} = req.body;

  try {
    const residencies = await prisma.residency.findMany({
      where: { teleNumber:teleNumber,status: "rented" },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(residencies);
  } catch (err) {
    throw new Error(err.message);
  }
});
 

 const getFilteredDraftResidencies = asyncHandler(async (req, res, hasEmail) => {
  try {
    const drafts = await prisma.residency.findMany({
      where: { status: "draft" },
      orderBy: {
        createdAt: "desc",
      },
    });

    const filteredDrafts = drafts.filter(draft => (hasEmail ? draft.email : !draft.email));

    res.json(filteredDrafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Controller for agent draft residencies
export const getAllAgentDraftResidencies = asyncHandler(async (req, res) => {
  return getFilteredDraftResidencies(req, res, true); // Filter by presence of email
});

// Controller for owner draft residencies
export const getAllOwnerDraftResidencies = asyncHandler(async (req, res) => {
  return getFilteredDraftResidencies(req, res, false); // Filter by absence of email
});

export const publishResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    const residency = await prisma.residency.update({
      where: { id: id },
      data: {
        status: "published",
      },
    });
    res.status(200).json({ message: "Residency published", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export const drafttores = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    const residency = await prisma.residency.update({
      where: { id: id },
      data: {
        status: "draft",
      },
    });
    res.status(200).json({ message: "Residency drafted", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export const archieveResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    const residency = await prisma.residency.update({
      where: { id: id },
      data: {
        status: "archieve",
      },
    });
    res.status(200).json({ message: "Residency archieved", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export const rentedResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    const residency = await prisma.residency.update({
      where: { id: id },
      data: {
        status: "rented",
      },
    });
    res.status(200).json({ message: "Residency rented", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const getResidency = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const residency = await prisma.residency.findUnique({
      where: {
        id: id,
      },
    });
    res.json(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});

export const updateResidency = asyncHandler(async (req, res) => {
  const { id } = req.params; // Residency ID
  const data = req.body; // Property data from frontend
  console.log(req.body);

  try {

   const parsedData = {
      ...data,
      price: data.price ? parseInt(data.price, 10) : null, // Convert price to int
      discount: data.discount ? parseInt(data.discount, 10) : null, // Convert discount to int
      deposit: data.deposit ? parseInt(data.deposit, 10) : null, // Convert deposit to int
      commission: data.commission ? parseInt(data.commission, 10) : null, // Convert commission to int
      rooms: data.rooms ? parseInt(data.rooms, 10) : null, // Convert rooms to int
      floor: data.floor ? parseInt(data.floor, 10) : null, // Convert floor to int
      totalFloors: data.totalFloors ? parseInt(data.totalFloors, 10) : null, // Convert totalFloors to int
      area: data.area ? parseFloat(data.area) : null, // Convert area to float
      parking: data.parking ? parseInt(data.parking, 10) : null, // Convert parking to int
    };
    
   const residency = await prisma.residency.update({
      where: { id: id },
      data: {
        title: parsedData.title,
        address: parsedData.address,
        addressURL: parsedData.addressURL,
        googleaddressurl: parsedData.googleaddressurl,
        price: parsedData.price,
        dealType: parsedData.dealType,
        rooms: parsedData.rooms,
        floor: parsedData.floor,
        totalFloors: parsedData.totalFloors,
        termDuration: parsedData.termDuration,
        city: parsedData.city,
        district: parsedData.district || [], // Default to empty array
        propertyType: parsedData.propertyType,
        residencyType: parsedData.residencyType,
        bathrooms: parsedData.bathrooms,
        description: parsedData.description,
        discount: parsedData.discount,
        area: parsedData.area,
        parking: parsedData.parking,
        currency: parsedData.currency,
        position: parsedData.position,
        deposit: parsedData.deposit,
        commission: parsedData.commission,
        images: parsedData.images || [], // Default to empty array
        video: parsedData.video,
        metro: parsedData.metro || [], // Default to empty array
        design: parsedData.design || [], // Default to empty array
        type: parsedData.type,
        paymentMethod: parsedData.paymentMethod,
        balcony: parsedData.balcony,
      },
    });
    res
      .status(200)
      .json({ message: "Residency updated successfully", residency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export const deleteResidency = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.residency.delete({
      where: { id: id },
    });
    res.status(200).json({ message: "residency deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get residency" });
  }
};
