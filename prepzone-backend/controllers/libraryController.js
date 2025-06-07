const Library = require("../models/Library");

exports.createLibrary = async (req, res) => {
  const { name, location, totalSeats, availableSeats, features } = req.body;

  try {
    const adminId = req.user._id; // ✅ token se adminId lo

    const library = new Library({
      adminId,
      name,
      location,
      totalSeats,
      availableSeats,
      amenities: features,
    });

    await library.save();
    res.status(201).json({ message: "Library created", library });
  } catch (error) {
    console.error("Library Create Error:", error.message);
    res.status(500).json({ error: "Failed to create library" });
  }
};


// Get all libraries by current admin
exports.getMyLibraries = async (req, res) => {
  try {
    const adminId = req.user._id; // assuming req.user is set by verifyToken middleware

    const libraries = await Library.find({ adminId });
    res.status(200).json({ libraries });
  } catch (error) {
    console.error("Get Libraries Error:", error.message);
    res.status(500).json({ error: "Failed to fetch libraries" });
  }
};

exports.updateLibrary = async (req, res) => {
  const libraryId = req.params.id;
  const { name, location, totalSeats, availableSeats, amenities } = req.body;

  try {
    const library = await Library.findById(libraryId);

    if (!library) {
      return res.status(404).json({ error: "Library not found" });
    }

    // Only the admin who created the library can update
    if (library.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Update fields
    library.name = name || library.name;
    library.location = location || library.location;
    library.totalSeats = totalSeats || library.totalSeats;
    library.availableSeats = availableSeats || library.availableSeats;
    library.amenities = amenities || library.amenities;

    await library.save();

    res.json({ message: "Library updated", library });
  } catch (error) {
    console.error("Update Library Error:", error.message);
    res.status(500).json({ error: "Failed to update library" });
  }
};

exports.deleteLibrary = async (req, res) => {
  const libraryId = req.params.id;

  try {
    const library = await Library.findById(libraryId);

    if (!library) {
      return res.status(404).json({ error: "Library not found" });
    }

    if (library.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await library.remove();
    res.json({ message: "Library deleted successfully" });
  } catch (error) {
    console.error("Delete Library Error:", error.message);
    res.status(500).json({ error: "Failed to delete library" });
  }
};

// 🔍 Public: Get all libraries
exports.getAllLibraries = async (req, res) => {
  try {
    const { location, amenities, minSeats } = req.query;

    let filter = {};

    // ✅ Filter by location
    if (location) {
      filter.location = { $regex: location, $options: "i" }; // case-insensitive match
    }

    // ✅ Filter by amenities (comma-separated)
    if (amenities) {
      const amenitiesArray = amenities.split(",");
      filter.amenities = { $all: amenitiesArray }; // must include all requested amenities
    }

    // ✅ Filter by available seats
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

 


