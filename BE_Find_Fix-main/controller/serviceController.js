const ServiceModel = require('../models/service');
const ProviderModel = require('../models/provider');
const OrderModel = require('../models/order');
const ReviewModel = require('../models/review');
const RoleModel = require('../models/role');
const UserModel = require('../models/user');
const serviceController = {};

serviceController.createService = async (req, res) => {
  try {
    // Extracting text fields from the request body
    const { title, providerId, description, price, openDateTime } = req.body;
    // Add service data to Firestore
    const servicesData = {
      title,// defaults to "" if empty
      providerId,// defaults to "" if empty
      description,// defaults to "" if empty
      price,// defaults to "" if empty
      openDateTime: openDateTime || []
    };
    await ServiceModel.registerService(servicesData);
    res.status(200).json({ code: 200, status: "Service Created" });
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

serviceController.storeimageService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    // The image file will be in req.file due to multer
    const imageFile = req.file;
    const docRef = await ServiceModel.findServiceById(serviceId);
    let storeimageurl = null;
    // Upload image to Firebase Storage if it exists
    if (imageFile) {
      storeimageurl = await ServiceModel.storeimageUrl(docRef, imageFile);
    }
    if (storeimageurl) {
      res.status(200).json({ code: 200, status: "Image Service Stored" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

serviceController.getAllServices = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const minPriceQuery = req.query.minprice || null;
    const maxPriceQuery = req.query.maxprice || null;

    let services = await ServiceModel.getAllServices(minPriceQuery, maxPriceQuery);

    if (services.length === 0) {
      res.status(200).json({ code: 200, status: "OK", services: [] });
    } else {
      services = await Promise.all(services.map(async (service) => {
        if (service.providerId) {
          const providerData = await ProviderModel.getProviderDataById(service.providerId);
          service.providerTitle = providerData.title;
          service.providerAddress = providerData.address;
        }
        const orderIds = await OrderModel.getServiceOrders(service.id);
        const reviewsData = orderIds.length > 0
          ? await ReviewModel.getRatingByOrderIds(orderIds)
          : { averageRating: 0, totalReviews: 0 };
        service.averageRating = reviewsData.averageRating;
        service.totalReviews = reviewsData.totalReviews;
        return service;
      }));
      // Filter the services based on provider title and address if searchQuery is specified
      if (searchQuery) {
        services = services.filter(service =>
          service.providerTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.providerAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      res.status(200).json({ code: 200, status: "OK", services: services });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

serviceController.getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await ServiceModel.getServiceById(serviceId);

    if (!service) {
      res.status(400).json({ code: 400, status: "Not Found", message: "Service not found" });
      return;
    }

    // Retrieve provider data if providerId exists
    if (service.providerId) {
      const providerData = await ProviderModel.getProviderDataById(service.providerId);
      service.providerTitle = providerData.title; // Add provider title to service data
    }
    let reviews = [];
    // Fetch orders related to the service and calculate reviews data
    const orderIds = await OrderModel.getServiceOrders(service.id);
    const reviewsData = orderIds.length > 0
      ? await ReviewModel.getRatingByOrderIds(orderIds)
      : { averageRating: 0, totalReviews: 0 };
    if (reviewsData.totalReviews != 0) {
      reviews = await ReviewModel.getReviewsByOrderIds(orderIds);
    }
    service.averageRating = reviewsData.averageRating;
    service.totalReviews = reviewsData.totalReviews;

    res.status(200).json({ code: 200, status: "OK", service: service, reviews: reviews });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

serviceController.getAppointmentAvailableById = async (req, res) => {
  try {
    const serviceId = req.params.id;

    const openDateTime = await ServiceModel.getOpenDateTimeByServiceId(serviceId);

    res.status(200).json({ code: 200, status: "OK", openDateTime });
  } catch (error) {
    console.error("Error fetching openDateTime:", error);
    res.status(400).json({ code: 400, status: "Not Found", message: error.message });
  }
};

serviceController.updateOpenDateTime = async (req, res) => {
  try {
    const id = req.user.id;
    const serviceId = req.params.id;
    const { openDateTime } = req.body; // openDateTime should be an array of { openDate, openTime[] }
    let userData = await UserModel.findUserById(id);
    if (!openDateTime || !Array.isArray(openDateTime)) {
      res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid openDateTime data provided." });
      return;
    }

    // Validate each openDateTime item structure
    if (!openDateTime.every(odt => odt.openDate && Array.isArray(odt.openTime) && odt.openTime.length > 0)) {
      res.status(400).json({ code: 400, status: "Bad Request", message: "Each openDateTime must include an openDate and a non-empty openTime array." });
      return;
    }
    if (!userData) {
      // Jika dokumen tidak ditemukan, kirim response 404 Not Found
      res.status(400).json({ code: 400, status: "Not Found", message: "User not found" });
    } else {
      delete userData.password; // Hapus password dari data yang dikirim ke client
      const roleTitle = await RoleModel.getTitleByRoleId(userData.roleId);
      userData.role = roleTitle;
      delete userData.roleId;
    }
    if (userData.role == "admin") {
      const updateResult = await ServiceModel.updateOpenDateTime(serviceId, openDateTime);
      res.status(200).json({ code: 200, status: "Update Open Date Time Successfull" });
    }
    else {
      return res.status(400).json({ code: 400, status: "Bad Request", message: "Invalid status provided." });
    }
  } catch (error) {
    console.error("Error updating openDateTime:", error);
    res.status(400).json({ code: 400, status: "Internal Server Error", message: error.message });
  }
};


module.exports = serviceController;