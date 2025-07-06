const Library = require("../models/Library");

// ✅ CREATE LIBRARY
exports.createLibrary = async (req, res) => {
  const {
    name,
    location,
    totalSeats,
    availableSeats,
    amenities, 
    phoneNumber,
    address,
    prices,
  } = req.body;

  try {
    const adminId = req.user._id;

    const parsedAmenities =
      Array.isArray(amenities)
        ? amenities
        : typeof amenities === "string"
        ? amenities.split(",").map((item) => item.trim())
        : [];

    const library = new Library({
      adminId,
      name,
      location,
      totalSeats,
      availableSeats,
      amenities: parsedAmenities,
      phoneNumber,
      address,
      prices: {
        sixHour: prices?.sixHour || 0,
        twelveHour: prices?.twelveHour || 0,
        twentyFourHour: prices?.twentyFourHour || 0,
      },
    });

    await library.save();
    res.status(201).json({ message: "Library created", library });
  } catch (error) {
    console.error("Library Create Error:", error.message);
    res.status(500).json({ error: "Failed to create library" });
  }
};


//  GET ALL LIBRARIES by current ADMIN
exports.getMyLibraries = async (req, res) => {
  try {
    const adminId = req.user._id;
    const libraries = await Library.find({ adminId });
    res.status(200).json({ libraries });
  } catch (error) {
    console.error("Get Libraries Error:", error.message);
    res.status(500).json({ error: "Failed to fetch libraries" });
  }
};

//  UPDATE LIBRARY
exports.updateLibrary = async (req, res) => {
  const libraryId = req.params.id;
  const {
    name,
    location,
    totalSeats,
    availableSeats,
    amenities,
    phoneNumber,
    address,
    prices,
  } = req.body;

  try {
    const library = await Library.findById(libraryId);
    if (!library) return res.status(404).json({ error: "Library not found" });

    if (library.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update fields
    library.name = name || library.name;
    library.location = location || library.location;
    library.totalSeats = totalSeats || library.totalSeats;
    library.availableSeats = availableSeats || library.availableSeats;
    library.amenities = amenities || library.amenities;
    library.phoneNumber = phoneNumber || library.phoneNumber;
    library.address = address || library.address;

    //  Update pricing if provided
    if (prices) {
      library.prices = {
        sixHour: prices.sixHour ?? library.prices.sixHour,
        twelveHour: prices.twelveHour ?? library.prices.twelveHour,
        twentyFourHour: prices.twentyFourHour ?? library.prices.twentyFourHour,
      };
    }

    await library.save();
    res.json({ message: "Library updated", library });
  } catch (error) {
    console.error("Update Library Error:", error.message);
    res.status(500).json({ error: "Failed to update library" });
  }
};

// DELETE LIBRARY
exports.deleteLibrary = async (req, res) => {
  const libraryId = req.params.id;

  try {
    const library = await Library.findById(libraryId);
    if (!library) return res.status(404).json({ error: "Library not found" });

    if (library.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Library.findByIdAndDelete(libraryId);
    res.json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Delete Library Error:", error.message);
    res.status(500).json({ error: "Failed to delete library" });
  }
};

//  PUBLIC: GET ALL LIBRARIES
exports.getAllLibraries = async (req, res) => {
  try {
    const { location, amenities, minSeats } = req.query;
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");
      filter.amenities = { $all: amenitiesArray };
    }

    if (minSeats) {
      filter.availableSeats = { $gte: parseInt(minSeats) };
    }

    const libraries = await Library.find(filter).populate("adminId", "name");
    res.status(200).json({ libraries });
  } catch (error) {
    console.error("Filter Libraries Error:", error.message);
    res.status(500).json({ error: "Failed to fetch libraries" });
  }
};

// PUBLIC: GET SINGLE LIBRARY BY ID
exports.getLibraryById = async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);
    if (!library) return res.status(404).json({ error: "Library not found" });
    res.status(200).json({ library });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch library" });
  }
};
